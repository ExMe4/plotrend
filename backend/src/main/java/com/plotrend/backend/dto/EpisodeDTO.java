package com.plotrend.backend.dto;

import java.time.LocalDate;

public class EpisodeDTO {
    private Long id;
    private Integer seasonNumber;
    private Integer episodeNumber;
    private LocalDate airDate;
    private Double rating;
    private String description;
    private String imdbId;

    public EpisodeDTO(Long id, Integer seasonNumber, Integer episodeNumber, LocalDate airDate, Double rating, String description, String imdbId) {
        this.id = id;
        this.seasonNumber = seasonNumber;
        this.episodeNumber = episodeNumber;
        this.airDate = airDate;
        this.rating = rating;
        this.description = description;
        this.imdbId = imdbId;
    }

    public Long getId() { return id; }
    public Integer getSeasonNumber() { return seasonNumber; }
    public Integer getEpisodeNumber() { return episodeNumber; }
    public LocalDate getAirDate() { return airDate; }
    public Double getRating() { return rating; }
    public String getDescription() { return description; }
    public String getImdbId() { return imdbId; }
}
