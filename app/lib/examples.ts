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