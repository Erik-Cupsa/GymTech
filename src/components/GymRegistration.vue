
<template>
  <!-- Note: This is a demo component, it is not routed to anywhere -->
    <div id="eventregistration">
      <h2>Persons</h2>
      <table>
        <tr v-for="person in persons" :key="person.name">
          <td>{{ person.name }}</td>
          <td>
            <ul>
              <li v-for="event in person.events" :key="event.name">
                {{ event.name }}
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <td>
            <input type="text" v-model="newPerson" placeholder="Person Name">
          </td>
          <td>
            <button v-bind:disabled="!newPerson" @click="createPerson(newPerson)">Create Person</button>
          </td>
        </tr>
      </table>
      <p>
        <span v-if="errorPerson" style="color:red">Error: {{ errorPerson }}</span>
      </p>
    </div>
  </template>
  
<script src="./registration.js">
</script>
  
  <style>
  #eventregistration {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    color: #2c3e50;
    background: #f2ece8;
  }
  </style>  