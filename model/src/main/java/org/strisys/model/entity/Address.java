package org.strisys.model.entity;

import java.util.Objects;
import java.util.UUID;
import jakarta.persistence.*;
import org.strisys.model.entity.superclass.impl.BaseEntity;

@Entity
@Table(name = "address", indexes = {
    @Index(name = "idx_address_uuid", columnList = "uuid", unique = true)
})
//noinspection RedundantLombok
public class Address extends BaseEntity {
    public Address() {
        this.uuid = UUID.randomUUID().toString();
    }

    public Address(AddressState address) {
        this.uuid = (uuid != null) ? uuid : UUID.randomUUID().toString();
        this.streetName = address.getStreet1();
        this.streetSuffix = address.getStreet2();
        this.city = address.getCity();
        this.postalCode = address.getZipCode();
    }

    public Address(
        String uuid,
        String houseNumber,
        String streetData,
        String streetName,
        String streetSuffix,
        String city,
        String postalCode
    ) {
        this.uuid = (uuid != null) ? uuid : UUID.randomUUID().toString();
        this.houseNumber = houseNumber;
        this.streetData = streetData;
        this.streetName = streetName;
        this.streetSuffix = streetSuffix;
        this.city = city;
//        this.stateCd = stateCd;
        this.postalCode = postalCode;
    }

    @Column(name = "uuid", nullable = false, updatable = false, unique = true, length = 36)
    private String uuid;

    @Column(name = "house_number", length = Integer.MAX_VALUE)
    private String houseNumber;

    @Column(name = "street_data", length = Integer.MAX_VALUE)
    private String streetData;

    @Column(name = "street_name", length = Integer.MAX_VALUE)
    private String streetName;

    @Column(name = "street_suffix", length = Integer.MAX_VALUE)
    private String streetSuffix;

    @Column(name = "city", length = Integer.MAX_VALUE)
    private String city;

    @Column(name = "postal_code", length = 32)
    private String postalCode;

    public String getUUID() {
        return (this.uuid != null) ? this.uuid : (this.uuid = UUID.randomUUID().toString());
    }

    public void setUUID(String uuid) {
        this.uuid = (uuid != null) ? uuid : UUID.randomUUID().toString();
    }

    public String getStreetData() {
        return streetData;
    }

    public void setStreetData(String streetData) {
        this.streetData = streetData;
    }

    public String getStreetName() {
        return streetName;
    }

    public void setStreetName(String streetName) {
        this.streetName = streetName;
    }

    public String getStreetSuffix() {
        return streetSuffix;
    }

    public void setStreetSuffix(String streetSuffix) {
        this.streetSuffix = streetSuffix;
    }


    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getHouseNumber() {
        return houseNumber;
    }

    public void setHouseNumber(String houseNumber) {
        this.houseNumber = houseNumber;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.getId());
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        Address other = (Address) obj;
        return Objects.equals(super.getId(), other.getId());
    }


    @Override
    public String toString() {
        return "{\"Address\":"

                + ",         \"streetData\":\"" + streetData + "\""
                + ",         \"streetName\":\"" + streetName + "\""
                + ",         \"streetSuffix\":\"" + streetSuffix + "\""
                + super.toString()
                + "}";
    }
}