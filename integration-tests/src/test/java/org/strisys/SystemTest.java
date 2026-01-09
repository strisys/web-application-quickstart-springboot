//package org.strisys;
//
//import org.junit.jupiter.api.Test;
//import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
//import org.springframework.test.context.ActiveProfiles;
//
//import static org.assertj.core.api.Assertions.assertThat;
//
////@DataJpaTest
////@Import({ AddressDataService.class, H2ServerConfig.class, TestUtil.class })
//@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
//@ActiveProfiles("test")
//public class SystemTest {
////    @Autowired
////    private AddressDataService addressService;
////
////    @Autowired
////    private TestUtil testUtil;
////
////    private void tryWait(Integer waitSeconds) {
////        testUtil.tryWait(waitSeconds);
////    }
//
////    private AddressState create() {
////        return AddressState.builder()
////                .street1(String.format("123 Elm Street [%s]", UUID.randomUUID().toString().substring(0, 3)))
////                .city("Metropolis")
////                .state("NY")
////                .zipCode("12345")
////                .build();
////    }
////
////    private static Address assertMatch(Address entity, AddressState addressState) {
////        assertThat(entity.getId()).isNotNull();
////        assertThat(entity.getStreetName()).isEqualTo(addressState.getStreet1());
////        assertThat(entity.getCity()).isEqualTo(addressState.getCity());
////        assertThat(entity.getPostalCode()).isEqualTo(addressState.getZipCode());
////        return entity;
////    }
//
//
//
//    @Test
//    void run_usecases() {
//
//    }
//}
