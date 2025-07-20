package com.plotrend.backend.controller;

import com.plotrend.backend.model.TVShow;
import com.plotrend.backend.model.Episode;
import com.plotrend.backend.model.CastMember;
import com.plotrend.backend.repository.TVShowRepository;
import com.plotrend.backend.repository.EpisodeRepository;
import com.plotrend.backend.repository.CastMemberRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000") // frontend dev port
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
    public List<TVShow> getAllShows() {
        return tvShowRepository.findAll();
    }

    @GetMapping("/{id}")
    public TVShow getShowById(@PathVariable Long id) {
        return tvShowRepository.findById(id).orElse(null);
    }

    @GetMapping("/{id}/episodes")
    public List<Episode> getEpisodesByShowId(@PathVariable Long id) {
        return episodeRepository.findByTvShowId(id);
    }

    @GetMapping("/{id}/cast")
    public List<CastMember> getCastByShowId(@PathVariable Long id) {
        return castMemberRepository.findByTvShowId(id);
    }
}
