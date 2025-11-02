package org.strisys.data;

import java.sql.SQLException;
import java.util.UUID;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import static org.assertj.core.api.Assertions.assertThat;

import org.strisys.data.rdms.H2ServerConfig;
import org.strisys.model.entity.AddressState;
import org.strisys.model.entity.Address;

@DataJpaTest
@Import({ AddressDataService.class, H2ServerConfig.class, TestUtil.class })
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
public class AddressDataServiceTest {
    @Autowired
    private AddressDataService addressService;

    @Autowired
    private TestUtil testUtil;

    private void tryWait(Integer waitSeconds) {
        testUtil.tryWait(waitSeconds);
    }

    private AddressState create() {
        return AddressState.builder()
                .street1(String.format("123 Elm Street [%s]", UUID.randomUUID().toString().substring(0, 3)))
                .city("Metropolis")
                .state("NY")
                .zipCode("12345")
                .build();
    }

    private static Address assertMatch(Address entity, AddressState addressState) {
        assertThat(entity.getId()).isNotNull();
        assertThat(entity.getStreetName()).isEqualTo(addressState.getStreet1());
        assertThat(entity.getCity()).isEqualTo(addressState.getCity());
        assertThat(entity.getPostalCode()).isEqualTo(addressState.getZipCode());
        return entity;
    }



    @Test
    void whenPersisted_thenTestLifeCycle() {
        AddressState addressState = create();

        // Apply, Assert (post persist)
        Address persisted = addressService.createAndPersist(addressState);
        assertMatch(persisted, addressState);

        // Apply, Assert (post fetch)
        assertMatch(addressService.findByUUID(persisted.getUUID()).orElseThrow(), addressState);

        tryWait(20);
    }
}
