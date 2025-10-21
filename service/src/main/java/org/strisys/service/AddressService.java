package org.strisys.service;

import org.springframework.stereotype.Service;

import org.strisys.data.AddressDataService;
import org.strisys.model.entity.AddressState;
import org.strisys.model.entity.Address;

import java.util.Optional;

@Service
public class AddressService {
    private final AddressDataService ds;

    public AddressService(AddressDataService ds) {
        this.ds = ds;
    }

    public Address createAndPersist(AddressState state) {
        return ds.createAndPersist(state);
    }

    public Optional<Address> findByUUID(String value) {
        return ds.findByUUID(value);
    }
}
