package com.plotrend.backend.controller;

import com.plotrend.backend.dto.TVShowDTO;
import com.plotrend.backend.dto.EpisodeDTO;
import com.plotrend.backend.dto.CastMemberDTO;
import com.plotrend.backend.repository.TVShowRepository;
import com.plotrend.backend.repository.EpisodeRepository;
import com.plotrend.backend.repository.CastMemberRepository;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/shows")
public class TVShowController {

    private final TVShowRepository tvShowRepository;
    private final EpisodeRepository episodeRepository;
    private final CastMemberRepository castMemberRepository;

    public TVShowController(TVShowRepository tvShowRepository,
                            EpisodeRepository episodeRepository,
                            CastMemberRepository castMemberRepository) {
        this.tvShowRepository = tvShowRepository;
        this.episodeRepository = episodeRepository;
        this.castMemberRepository = castMemberRepository;
    }

    @GetMapping
    public List<TVShowDTO> getAllShows() {
        return tvShowRepository.findAll().stream()
                .map(show -> new TVShowDTO(
                        show.getId(),
                        show.getTitle(),
                        show.getStartYear(),
                        show.getEndYear(),
                        show.getCoverImageUrl(),
                        show.getSlug()
                ))
                .toList();
    }

    @GetMapping("/search")
    public List<TVShowDTO> searchShows(@RequestParam String q) {
        return tvShowRepository.findByTitleContainingIgnoreCase(q).stream()
                .map(show -> new TVShowDTO(
                        show.getId(),
                        show.getTitle(),
                        show.getStartYear(),
                        show.getEndYear(),
                        show.getCoverImageUrl(),
                        show.getSlug()
                ))
                .toList();
    }

    @GetMapping("/{id}")
    public TVShowDTO getShowById(@PathVariable Long id) {
        return tvShowRepository.findById(id)
                .map(show -> new TVShowDTO(
                        show.getId(),
                        show.getTitle(),
                        show.getStartYear(),
                        show.getEndYear(),
                        show.getCoverImageUrl(),
                        show.getSlug()
                ))
                .orElse(null);
    }

    @GetMapping("/{id}/episodes")
    public List<EpisodeDTO> getEpisodesByShowId(@PathVariable Long id) {
        return episodeRepository.findByTvShowId(id).stream()
                .map(ep -> new EpisodeDTO(
                        ep.getId(),
                        ep.getSeasonNumber(),
                        ep.getEpisodeNumber(),
                        ep.getAirDate(),
                        ep.getRating(),
                        ep.getDescription(),
                        ep.getImdbId()
                ))
                .toList();
    }

    @GetMapping("/{id}/cast")
    public List<CastMemberDTO> getCastByShowId(@PathVariable Long id) {
        return castMemberRepository.findByTvShowId(id).stream()
                .map(cm -> new CastMemberDTO(
                        cm.getId(),
                        cm.getActorName(),
                        cm.getCharacterName(),
                        cm.getImageUrl(),
                        cm.getStartSeason(),
                        cm.getEndSeason()
                ))
                .toList();
    }

    @GetMapping("/slug/{slug}")
    public TVShowDTO getShowBySlug(@PathVariable String slug) {
        return tvShowRepository.findBySlug(slug)
                .map(show -> new TVShowDTO(
                        show.getId(),
                        show.getTitle(),
                        show.getStartYear(),
                        show.getEndYear(),
                        show.getCoverImageUrl(),
                        show.getSlug()
                ))
                .orElse(null);
    }
}
