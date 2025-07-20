package com.plotrend.backend.model;

import jakarta.persistence.*;

@Entity
public class CastMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String actorName;
    private String characterName;
    private String imageUrl;
    private Integer startSeason;
    private Integer endSeason;

    @ManyToOne
    @JoinColumn(name = "tv_show_id")
    private TVShow tvShow;
}
