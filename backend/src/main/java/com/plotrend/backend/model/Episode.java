package com.plotrend.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Episode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer seasonNumber;
    private Integer episodeNumber;
    private LocalDate airDate;
    private Double rating;
    private String description;
    private String imdbId;

    @ManyToOne
    @JoinColumn(name = "tv_show_id")
    private TVShow tvShow;
}
