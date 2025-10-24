// app/lib/examples.ts

export const TEST_GENERATOR_EXAMPLES = {
  react: `import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}`,

  vue: `<template>
  <div>
    <h1>Count: {{ count }}</h1>
    <button @click="increment">Increment</button>
    <button @click="reset">Reset</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0
    };
  },
  methods: {
    increment() {
      this.count++;
    },
    reset() {
      this.count = 0;
    }
  }
};
</script>`,

  svelte: `<script>
  let count = 0;

  function increment() {
    count += 1;
  }

  function reset() {
    count = 0;
  }
</script>

<div>
  <h1>Count: {count}</h1>
  <button on:click={increment}>Increment</button>
  <button on:click={reset}>Reset</button>
</div>`,
};

export const ERROR_EXPLAINER_EXAMPLE = {
  code: `function UserList({ users }) {
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}`,
  error: `TypeError: Cannot read property 'map' of undefined
    at UserList (UserList.js:6:16)`,
};

export const BUG_FORMATTER_EXAMPLE = `hey the login button doesnt work when i click it says undefined and also the colors look weird on my phone maybe its the css? idk but its broken on safari too`;
// Backend Testing Examples
export const BACKEND_TEST_EXAMPLES = {
  python: `def calculate_total(items, tax_rate=0.1):
    """Calculate total price with tax."""
    if not items:
        raise ValueError("Items list cannot be empty")
    
    subtotal = sum(item['price'] * item['quantity'] for item in items)
    tax = subtotal * tax_rate
    return round(subtotal + tax, 2)

def get_user_by_id(user_id, db):
    """Fetch user from database."""
    if not isinstance(user_id, int) or user_id <= 0:
        raise ValueError("Invalid user ID")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise NotFoundError(f"User {user_id} not found")
    
    return user`,

  node: `const express = require('express');
const router = express.Router();

// GET /api/users/:id
router.get('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId) || userId <= 0) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const user = await db.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;`,

  go: `package calculator

import (
    "errors"
    "math"
)

type Item struct {
    Price    float64
    Quantity int
}

func CalculateTotal(items []Item, taxRate float64) (float64, error) {
    if len(items) == 0 {
        return 0, errors.New("items list cannot be empty")
    }
    
    if taxRate < 0 || taxRate > 1 {
        return 0, errors.New("tax rate must be between 0 and 1")
    }
    
    var subtotal float64
    for _, item := range items {
        subtotal += item.Price * float64(item.Quantity)
    }
    
    tax := subtotal * taxRate
    total := subtotal + tax
    
    return math.Round(total*100) / 100, nil
}`,

  java: `public class UserService {
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public User getUserById(Long userId) {
        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("Invalid user ID");
        }
        
        return userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException(
                "User with id " + userId + " not found"
            ));
    }
    
    public User createUser(String name, String email) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be empty");
        }
        
        if (!isValidEmail(email)) {
            throw new IllegalArgumentException("Invalid email format");
        }
        
        User user = new User(name, email);
        return userRepository.save(user);
    }
}`,

  ruby: `class OrderCalculator
  def initialize(tax_rate: 0.1)
    @tax_rate = tax_rate
  end

  def calculate_total(items)
    raise ArgumentError, 'Items cannot be empty' if items.empty?

    subtotal = items.sum { |item| item[:price] * item[:quantity] }
    tax = subtotal * @tax_rate
    (subtotal + tax).round(2)
  end

  def apply_discount(total, discount_code)
    return total unless valid_discount?(discount_code)

    discount_amount = case discount_code
                      when 'SAVE10' then total * 0.1
                      when 'SAVE20' then total * 0.2
                      else 0
                      end

    (total - discount_amount).round(2)
  end

  private

  def valid_discount?(code)
    %w[SAVE10 SAVE20].include?(code)
  end
end`,

  php: `<?php

class UserService {
    private $userRepository;
    
    public function __construct(UserRepository $userRepository) {
        $this->userRepository = $userRepository;
    }
    
    public function getUserById(int $userId): User {
        if ($userId <= 0) {
            throw new InvalidArgumentException('Invalid user ID');
        }
        
        $user = $this->userRepository->find($userId);
        
        if ($user === null) {
            throw new UserNotFoundException(
                "User with id {$userId} not found"
            );
        }
        
        return $user;
    }
    
    public function createUser(string $name, string $email): User {
        if (empty(trim($name))) {
            throw new InvalidArgumentException('Name cannot be empty');
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('Invalid email format');
        }
        
        $user = new User($name, $email);
        return $this->userRepository->save($user);
    }
}`,
};