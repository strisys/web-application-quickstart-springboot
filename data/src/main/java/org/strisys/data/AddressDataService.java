package org.strisys.data;

import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import org.strisys.model.entity.Address;
import org.strisys.model.entity.AddressState;
import org.strisys.data.rdms.AddressRepository;

import java.util.Optional;


@Service
public class AddressDataService {
    private final AddressRepository repo;
    private final EntityManager em;

    public AddressDataService(AddressRepository repo, EntityManager em) {
        this.repo = repo;
        this.em = em;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Address createAndPersist(AddressState state) {
        Address inMemory = new Address(state);

        Address managed = repo.save(inMemory); // MANAGED; id assigned on flush
        repo.flush();

        return managed;
    }

    public Optional<Address> findByUUID(String value) {
        return this.repo.findByUuid(value);
    }
}
