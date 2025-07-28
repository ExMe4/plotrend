package com.plotrend.backend.dto;

public class TVShowDTO {
    private Long id;
    private String title;
    private Integer startYear;
    private Integer endYear;
    private String coverImageUrl;
    private String slug;

    public TVShowDTO(Long id, String title, Integer startYear, Integer endYear, String coverImageUrl, String slug) {
        this.id = id;
        this.title = title;
        this.startYear = startYear;
        this.endYear = endYear;
        this.coverImageUrl = coverImageUrl;
        this.slug = slug;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public Integer getStartYear() { return startYear; }
    public Integer getEndYear() { return endYear; }
    public String getCoverImageUrl() { return coverImageUrl; }
    public String getSlug() { return slug; }
}
