package com.plotrend.backend.importer;

import com.plotrend.backend.model.*;
import com.plotrend.backend.repository.*;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.zip.GZIPInputStream;

@Component
@Profile("import")
public class ImdbDataImporter implements ApplicationRunner {

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (tvShowRepo.count() == 0) {
            runImport();
        } else {
            System.out.println("Skipping IMDb import: Database is already populated.");
        }
    }

    private final TVShowRepository tvShowRepo;
    private final EpisodeRepository episodeRepo;
    private final CastMemberRepository castRepo;

    public ImdbDataImporter(TVShowRepository tvShowRepo,
                            EpisodeRepository episodeRepo,
                            CastMemberRepository castRepo) {
        this.tvShowRepo = tvShowRepo;
        this.episodeRepo = episodeRepo;
        this.castRepo = castRepo;
    }

    public void runImport() throws Exception {
        System.out.println("Starting IMDb Import...");

        Map<String, TVShow> tvShowMap = parseTVShows(); // tconst -> TVShow
        Map<String, Double> ratingMap = parseRatings();
        parseEpisodes(tvShowMap, ratingMap);
        parseCast(tvShowMap);

        System.out.println("IMDb Import Finished");
    }

    private Map<String, TVShow> parseTVShows() throws IOException {
        Map<String, TVShow> showMap = new HashMap<>();

        try (BufferedReader reader = createReader("imdb/title.basics.tsv.gz")) {
            String line = reader.readLine(); // skip header

            while ((line = reader.readLine()) != null) {
                String[] parts = line.split("\t");

                String tconst = parts[0];
                String titleType = parts[1];
                String primaryTitle = parts[2];
                String startYear = parts[5];
                String endYear = parts[6];

                if (!"tvSeries".equals(titleType)) continue;

                TVShow show = new TVShow();
                show.setTitle(primaryTitle);
                show.setImdbId(tconst);
                show.setStartYear(parseInt(startYear));
                show.setEndYear(parseInt(endYear));

                tvShowRepo.save(show);
                showMap.put(tconst, show);
            }
        }

        return showMap;
    }

    private Map<String, Double> parseRatings() throws IOException {
        Map<String, Double> ratings = new HashMap<>();

        try (BufferedReader reader = createReader("imdb/title.ratings.tsv.gz")) {
            reader.readLine(); // skip header
            String line;

            while ((line = reader.readLine()) != null) {
                String[] parts = line.split("\t");
                String tconst = parts[0];
                double avgRating = Double.parseDouble(parts[1]);
                ratings.put(tconst, avgRating);
            }
        }

        return ratings;
    }

    private void parseEpisodes(Map<String, TVShow> showMap, Map<String, Double> ratingMap) throws IOException {
        try (BufferedReader reader = createReader("imdb/title.episode.tsv.gz")) {
            reader.readLine(); // skip header
            String line;

            while ((line = reader.readLine()) != null) {
                String[] parts = line.split("\t");
                String tconst = parts[0];
                String parentTconst = parts[1];
                String seasonNum = parts[2];
                String episodeNum = parts[3];

                TVShow parentShow = showMap.get(parentTconst);
                if (parentShow == null) continue;

                Episode episode = new Episode();
                episode.setImdbId(tconst);
                episode.setTvShow(parentShow);
                episode.setSeasonNumber(parseInt(seasonNum));
                episode.setEpisodeNumber(parseInt(episodeNum));
                episode.setRating(ratingMap.getOrDefault(tconst, 0.0));
                episode.setDescription(null); // optional, can be fetched later

                episodeRepo.save(episode);
            }
        }
    }

    private void parseCast(Map<String, TVShow> showMap) throws IOException {
        Map<String, TVShow> showById = new HashMap<>();
        for (TVShow show : tvShowRepo.findAll()) {
            showById.put(show.getImdbId(), show);
        }

        try (BufferedReader reader = createReader("imdb/title.principals.tsv.gz")) {
            reader.readLine();
            String line;

            while ((line = reader.readLine()) != null) {
                String[] parts = line.split("\t");
                String tconst = parts[0];
                String nconst = parts[2];
                String category = parts[3];
                String characters = parts.length > 5 ? parts[5] : "\\N";

                if (!"actor".equals(category) && !"actress".equals(category)) continue;
                TVShow show = showById.get(tconst);
                if (show == null) continue;

                CastMember member = new CastMember();
                member.setActorName(nconst); // name can be resolved from name.basics.tsv.gz later
                member.setCharacterName(cleanCharacter(characters));
                member.setTvShow(show);
                castRepo.save(member);
            }
        }
    }

    private String cleanCharacter(String raw) {
        if (raw == null || raw.equals("\\N")) return null;
        return raw.replaceAll("[\\[\\]\"]", "");
    }

    private Integer parseInt(String value) {
        return (value == null || value.equals("\\N")) ? null : Integer.parseInt(value);
    }

    private BufferedReader createReader(String filePath) throws IOException {
        InputStream fileStream = getClass().getClassLoader().getResourceAsStream(filePath);
        assert fileStream != null : "File not found: " + filePath;
        return new BufferedReader(new InputStreamReader(new GZIPInputStream(fileStream), StandardCharsets.UTF_8));
    }
}
