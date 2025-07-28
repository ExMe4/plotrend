package com.plotrend.backend.dto;

public class CastMemberDTO {
    private Long id;
    private String actorName;
    private String characterName;
    private String imageUrl;
    private Integer startSeason;
    private Integer endSeason;

    public CastMemberDTO(Long id, String actorName, String characterName, String imageUrl, Integer startSeason, Integer endSeason) {
        this.id = id;
        this.actorName = actorName;
        this.characterName = characterName;
        this.imageUrl = imageUrl;
        this.startSeason = startSeason;
        this.endSeason = endSeason;
    }

    public Long getId() { return id; }
    public String getActorName() { return actorName; }
    public String getCharacterName() { return characterName; }
    public String getImageUrl() { return imageUrl; }
    public Integer getStartSeason() { return startSeason; }
    public Integer getEndSeason() { return endSeason; }
}
