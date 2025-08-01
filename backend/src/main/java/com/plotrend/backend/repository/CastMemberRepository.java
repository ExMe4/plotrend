package com.plotrend.backend.repository;

import com.plotrend.backend.model.CastMember;
import com.plotrend.backend.model.TVShow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CastMemberRepository extends JpaRepository<CastMember, Long> {
    List<CastMember> findByTvShowId(Long tvShowId);
    boolean existsByActorNameAndTvShow(String actorName, TVShow tvShow);
}
