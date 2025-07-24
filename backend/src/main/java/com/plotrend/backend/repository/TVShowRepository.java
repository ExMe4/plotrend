package com.plotrend.backend.repository;

import com.plotrend.backend.model.TVShow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TVShowRepository extends JpaRepository<TVShow, Long> {
    boolean existsByImdbId(String imdbId);
    TVShow findByImdbId(String imdbId);
}
