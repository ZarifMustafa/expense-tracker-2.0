USE expenseTracker2;

CREATE TABLE expenses (
  expenseNo BIGINT PRIMARY KEY AUTO_INCREMENT,
  expenseName VARCHAR(255) NOT NULL,
  estimatedCost DECIMAL(10,2) NOT NULL DEFAULT 0,
  priority ENUM('High', 'Medium', 'Low') NOT NULL DEFAULT 'Medium',
  status ENUM('Pending', 'In Progress', 'Completed') NOT NULL DEFAULT 'Pending',
  color CHAR(7) NOT NULL DEFAULT '#FFFFFF',
  createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
