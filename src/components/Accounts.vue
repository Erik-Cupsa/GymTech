<template>
  <div class="accounts-page">
    <Navbar />
    <div class="accounts-table-container">
      <h1>
        <AnimatedLetters :letterClass="letterClass" :strArray="welcomeArray" :idx="14" />
      </h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="account in accounts" :key="account.id" @click="selectAccount(account.id)"
              :class="{ selected: selectedAccountId === account.id }">
            <td>{{ account.id }}</td>
            <td>{{ account.name }}</td>
            <td>{{ account.email }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="delete-button">
      <button @click="deleteAccount">Delete</button>
    </div>
  </div>
</template>

<script>
import AnimatedLetters from "./AnimatedLetters";
import Navbar from "./Navbar";

export default {
  name: 'Accounts',
  data() {
    return {
      letterClass: "text-animate",
      welcomeArray: "Accounts",
      accounts: [], // Initialize accounts data
      selectedAccountId: null,
    };
  },
  mounted() {
    setTimeout(() => {
      this.letterClass = "text-animate-hover";
    }, 4000);
    this.fetchAccounts(); // Fetch accounts data when component is mounted
  },
  components: {
    AnimatedLetters,
    Navbar
  },
  methods: {
    fetchAccounts() {
      // Here you can fetch the accounts data from the database using API calls or other methods
      // For now, let's simulate some sample accounts data
      this.accounts = [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
        { id: 3, name: "John ", email: "john1@example.com" },
      ];
    },
    selectAccount(accountId) {
      this.selectedAccountId = accountId;
    },
    deleteAccount() {
      if (!this.selectedAccountId) {
        alert('Please select an account to delete.');
        return;
      }
      // Simulate deleting the account from the front-end
      this.accounts = this.accounts.filter(account => account.id !== this.selectedAccountId);
      this.selectedAccountId = null; // Clear selection
    }
  }
};
</script>

<style scoped>
.accounts-page .text-animate {
  position: absolute;
  top: calc(50% + 30px); /* Adjust distance below navbar */
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 60px;
  margin: 0;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
}
.accounts-page .text-animate-hover {
  color: #fff;
  font-size: 60px;
  margin: 0;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  transition: color 0.5s ease-in-out;
}

.accounts-page .text-zone {
  position: absolute;
  align-content: center;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  width: 40%;
  max-height: 90%;
  display: absolute;
}
.accounts-page {
  padding: 20px;
  margin: auto;
}
.content {
  position: relative;
}

.accounts-page h1 {
  top: 40%; /* Adjust distance below navbar */
  color: #fff;
  font-size: 60px;
  margin: 0;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
}

.accounts-table-container {
  overflow-x: auto;
  overflow-y: auto;
  top: calc(45% + 20px); 
  position: absolute;
  left: 50%;
  transform: translate(-50%, -40%);
  width: 80%;
  max-height: calc(80%);
}


table {
  width: 100%;
  border-collapse: collapse;
}

table, th, td {
    padding: 8px;
    text-align: left;
    border: 1px solid #ccc;
    color: #FFF;
  }

th {
  background-color: #f0f0f0;
  color: #444;
  font-size: 20px; /* Adjust the font size here */
  padding: 5px;
}

tbody tr:hover {
  background-color: #0040ff;
}

td { 
  padding: 10px;
} 

tr:nth-child(even) {
  background-color: #f2f2f261;
}
tr:nth-child(odd) {
  background-color: #f2f2f2af;
}

.delete-button {
  display: flex;
  justify-content: flex-end;
  position: absolute;
  bottom: 30px; 
  right: 40px; 
}

button {
  padding: 10px 20px;
  background-color: #0040ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  opacity: 0.85;
}
.selected td {
  background-color: blue; /* Highlight selected account in blue */
}
</style>
