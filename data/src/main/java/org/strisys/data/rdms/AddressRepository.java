package org.strisys.data.rdms;

import java.util.Optional;

import org.strisys.model.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    Optional<Address> findByUuid(String value);
}