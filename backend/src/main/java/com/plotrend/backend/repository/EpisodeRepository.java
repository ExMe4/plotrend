package com.plotrend.backend.repository;

import com.plotrend.backend.model.Episode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EpisodeRepository extends JpaRepository<Episode, Long> {
    List<Episode> findByTvShowId(Long tvShowId);
}
