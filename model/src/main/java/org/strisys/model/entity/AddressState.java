package org.strisys.model.entity;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class AddressState {
    @Size(max = 100, message = "Street 1 must be at most 100 characters")
    private String street1;

    @Size(max = 100, message = "Street 2 must be at most 100 characters")
    @Pattern(regexp = "^[a-zA-Z0-9\\s,'#\\.\\-]*$", message = "Street 2 contains invalid characters")
    private String street2;

    @Size(max = 100, message = "Unit number")
    @Pattern(regexp = "^[a-zA-Z0-9\\s,'#\\.\\-]*$", message = "Unit number contains invalid characters")
    private String unitNumber;

    @Size(max = 50, message = "City must be at most 50 characters")
    @Pattern(regexp = "^[a-zA-Z\\s\\.\\-]+$", message = "City contains invalid characters")
    private String city;

    @Size(max = 50, message = "State must be at most 50 characters")
    private String state;

    @Pattern(regexp = "^\\d{5}(-\\d{4})?$", message = "Zip code must be a valid 5-digit or 9-digit format (e.g., 12345 or 12345-6789)")
    private String zipCode;

    @Pattern(regexp = "PRESENT|MAILING|FORMER", flags = Pattern.Flag.CASE_INSENSITIVE)
    @Nullable
    private String addressType;

}