package com.plotrend.backend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class TVShow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private Integer startYear;
    private Integer endYear;
    private String coverImageUrl;
    private String imdbId;

    @OneToMany(mappedBy = "tvShow", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Episode> episodes;

    @OneToMany(mappedBy = "tvShow", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CastMember> castMembers;
}
