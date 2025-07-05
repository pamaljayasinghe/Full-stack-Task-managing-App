package dto;



import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResetPasswordRequest {
    @Email
    private String email;
    @NotBlank
    private String token;
    @NotBlank
    private String newPassword;
}