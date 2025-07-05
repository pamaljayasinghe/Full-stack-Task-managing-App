package repository;

import entity.Task;
import entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUser(User user);
    List<Task> findByUserId(Long userId);
    List<Task> findByUserIdAndDueDateBetween(Long userId, LocalDateTime start, LocalDateTime end);
}