package org.strisys.data;

import java.sql.SQLException;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.strisys.data.rdms.H2ServerConfig;
import org.strisys.model.entity.Photo;
import org.strisys.model.entity.PhotoState;
import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Import({ PhotoDataService.class, H2ServerConfig.class, TestUtil.class })
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
public class PhotoDataServiceTest {
    @Autowired
    private PhotoDataService service;

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private TestUtil testUtil;

    @BeforeAll
    static void startH2Servers() throws SQLException {
    }

    private void tryWait(Integer waitSeconds) {
        testUtil.tryWait(waitSeconds);
    }

    private PhotoState create() {
        return PhotoState.createRandom();
    }

    private static void assertMatch(PhotoState state, PhotoState originalState) {
        assertThat(state.getId()).isNotNull();
        assertThat(state.getUuid()).isEqualTo(originalState.getUuid());
        assertThat(state.getFileName()).isEqualTo(originalState.getFileName());
        assertThat(state.getContentType()).isEqualTo(originalState.getContentType());
        assertThat(state.isNull()).isEqualTo(originalState.isNull());
        assertThat(state.getId()).isGreaterThan(0);
    }

    @Test
    void whenPersisted_thenTestLifeCycle() {
        PhotoState originalState = create();

        // Apply, Assert (post persist)
        Photo persisted = service.save(originalState);
        assertMatch(persisted.getState(), originalState);

        // Apply, Assert (post fetch)
        Photo fetched = service.tryGet(persisted.getUuid());
        assertMatch(fetched.getState(), originalState);

        // View data in IntelliJ
        tryWait(0);

        // Apply, Assert (post fetch)
        Photo deleted = service.remove(persisted.getUuid());
        assertMatch(deleted.getState(), originalState);

        // Apply, Assert (post fetch)
        Photo fetchedPostDelete = service.tryGet(persisted.getUuid());
        assertThat(fetchedPostDelete.getIsNull()).isTrue();
    }
}
