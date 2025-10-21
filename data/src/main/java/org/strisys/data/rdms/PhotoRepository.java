package org.strisys.data.rdms;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.strisys.model.entity.PhotoState;

@Repository
public interface PhotoRepository extends JpaRepository<PhotoState, Long> {
    Optional<PhotoState> findByUuid(String value);
    Optional<PhotoState> deleteByUuid(String value);
}