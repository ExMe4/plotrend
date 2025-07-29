package com.plotrend.backend.importer;

import com.plotrend.backend.model.*;
import com.plotrend.backend.repository.*;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.*;
import java.util.zip.GZIPInputStream;

@Component
public class ImdbDataImporter implements ApplicationRunner {

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

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (tvShowRepo.count() == 0) {
            runImport();
        } else {
            System.out.println("Skipping IMDb import: Database is already populated.");
        }
    }

    public void runImport() throws Exception {
        System.out.println("Starting IMDb Import...");

        Map<String, String[]> basicsMap = parseTitleBasics(); // tconst -> [titleType, primaryTitle, startYear]
        Map<String, TVShow> tvShowMap = parseTVShows(basicsMap); // tconst -> TVShow
        Map<String, Double> ratingMap = parseRatings();
        parseEpisodes(tvShowMap, ratingMap, basicsMap);
        parseCast(tvShowMap);

        System.out.println("IMDb Import Finished");
    }

    private Map<String, String[]> parseTitleBasics() throws IOException {
        Map<String, String[]> map = new HashMap<>();
        try (BufferedReader reader = createReader("imdb/title.basics.tsv.gz")) {
            reader.readLine(); // skip header
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split("\t", -1);
                if (parts.length < 7) continue;

                String tconst = parts[0];
                String titleType = parts[1];
                String primaryTitle = parts[2];
                String startYear = parts[5];
                map.put(tconst, new String[]{titleType, primaryTitle, startYear});
            }
        }
        return map;
    }

    private Map<String, TVShow> parseTVShows(Map<String, String[]> basicsMap) {
        Map<String, TVShow> showMap = new HashMap<>();

        for (Map.Entry<String, String[]> entry : basicsMap.entrySet()) {
            String tconst = entry.getKey();
            String[] values = entry.getValue();

            String titleType = values[0];
            String title = values[1];
            String startYearStr = values[2];

            if (!"tvSeries".equals(titleType)) continue;

            TVShow existing = tvShowRepo.findByImdbId(tconst);
            if (existing != null) {
                showMap.put(tconst, existing);
                continue;
            }

            TVShow show = new TVShow();
            show.setImdbId(tconst);
            show.setTitle(title);
            show.setStartYear(parseInt(startYearStr));
            show.setSlug(toSlug(title));
            show.setEndYear(null); // todo
            show.setCoverImageUrl(null); // todo

            tvShowRepo.save(show);
            showMap.put(tconst, show);
        }

        return showMap;
    }

    private Map<String, Double> parseRatings() throws IOException {
        Map<String, Double> ratings = new HashMap<>();

        try (BufferedReader reader = createReader("imdb/title.ratings.tsv.gz")) {
            reader.readLine(); // skip header
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split("\t", -1);
                if (parts.length < 2) continue;

                String tconst = parts[0];
                double avgRating = Double.parseDouble(parts[1]);
                ratings.put(tconst, avgRating);
            }
        }

        return ratings;
    }

    private void parseEpisodes(Map<String, TVShow> showMap, Map<String, Double> ratingMap,
                               Map<String, String[]> basicsMap) throws IOException {
        try (BufferedReader reader = createReader("imdb/title.episode.tsv.gz")) {
            reader.readLine(); // skip header
            String line;

            while ((line = reader.readLine()) != null) {
                String[] parts = line.split("\t", -1);
                if (parts.length < 4) continue;

                String tconst = parts[0];
                String parentTconst = parts[1];
                String seasonNum = parts[2];
                String episodeNum = parts[3];

                TVShow parentShow = showMap.get(parentTconst);
                if (parentShow == null) continue;

                String[] basics = basicsMap.get(tconst);
                String title = basics != null ? basics[1] : "Unknown";
                String airDateStr = basics != null ? basics[2] : null;

                Episode episode = new Episode();
                episode.setImdbId(tconst);
                episode.setTvShow(parentShow);
                episode.setSeasonNumber(parseInt(seasonNum));
                episode.setEpisodeNumber(parseInt(episodeNum));
                episode.setRating(ratingMap.getOrDefault(tconst, 0.0));
                episode.setTitle(title);
                episode.setDescription("Episode: " + title); // todo
                episode.setAirDate(parseYearToDate(airDateStr));

                if (!episodeRepo.existsByImdbId(tconst)) {
                    episodeRepo.save(episode);
                }
            }
        }
    }

    private void parseCast(Map<String, TVShow> showMap) throws IOException {
        Map<String, TVShow> showById = new HashMap<>();
        for (TVShow show : tvShowRepo.findAll()) {
            showById.put(show.getImdbId(), show);
        }

        try (BufferedReader reader = createReader("imdb/title.principals.tsv.gz")) {
            reader.readLine(); // skip header
            String line;

            while ((line = reader.readLine()) != null) {
                String[] parts = line.split("\t", -1);
                if (parts.length < 6) continue;

                String tconst = parts[0];
                String nconst = parts[2];
                String category = parts[3];
                String characters = parts[5];

                if (!"actor".equals(category) && !"actress".equals(category)) continue;

                TVShow show = showById.get(tconst);
                if (show == null) continue;

                CastMember member = new CastMember();
                member.setActorName(nconst); // todo name can be resolved from name.basics.tsv.gz later
                member.setCharacterName(cleanCharacter(characters));
                member.setTvShow(show);

                if (!castRepo.existsByActorNameAndTvShow(member.getActorName(), show)) {
                    castRepo.save(member);
                }
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

    private LocalDate parseYearToDate(String yearStr) {
        if (yearStr == null || yearStr.equals("\\N")) return null;
        try {
            int year = Integer.parseInt(yearStr);
            return LocalDate.of(year, 1, 1); // Default to Jan 1st
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private BufferedReader createReader(String filePath) throws IOException {
        InputStream fileStream = getClass().getClassLoader().getResourceAsStream(filePath);
        assert fileStream != null : "File not found: " + filePath;
        return new BufferedReader(new InputStreamReader(new GZIPInputStream(fileStream), StandardCharsets.UTF_8));
    }

    private String toSlug(String input) {
        return input.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
    }
}