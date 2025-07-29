package com.plotrend.backend.repository;

import com.plotrend.backend.model.TVShow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TVShowRepository extends JpaRepository<TVShow, Long> {
    boolean existsByImdbId(String imdbId);
    TVShow findByImdbId(String imdbId);
    List<TVShow> findByTitleContainingIgnoreCase(String title);
    Optional<TVShow> findBySlug(String slug);
}
