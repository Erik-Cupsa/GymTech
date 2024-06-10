<template>
    <div class="container classtype-page">
      <Navbar /> 
      <h1>
          <AnimatedLetters :letterClass="letterClass" :strArray="titleArray" :idx="12" />
    </h1>
      <div class="text-zone">
        <br />
        <div class="left-section">
          <h2>Explore Our Diverse Range of Class Types! <br /><br /> Discover a wide variety of gym classes tailored to suit your fitness needs, from yoga and HIIT to strength training and more. <br/><br />
          </h2>
          <div v-if="approvedClassTypes.length > 0">
            <h3>Approved Class Types:</h3>
            <ul>
              <li v-for="classType in approvedClassTypes" :key="classType.id">
                {{ classType.name }}
                <button @click="editClassType(classType)">Edit</button>
                <button @click="deleteClassType(classType)">Remove</button>
              </li>
            </ul>
          </div>
          <div v-if="unapprovedClassTypes.length > 0">
            <h3>Class Types Needing Approval:</h3>
            <ul>
              <li v-for="classType in unapprovedClassTypes" :key="classType.id">
                {{ classType.name }}
                <button @click="approveClassType(classType)">Approve</button>
                <button @click="deleteClassType(classType)">Remove</button>
              </li>
            </ul>
          </div>
          <div v-else-if="classTypesNotFound">
            <p>There are no class types in the system.</p>
          </div>
        </div>
        <div class="right-section">
          <h2>If you're a gym owner you can create new class types here:</h2>
          <input type="text" v-model="newClassTypeName" placeholder="Enter new class type name">
          <button @click="addClassType">Add Class Type</button>
          <h2>If you're an instructor, please propose class types here:</h2>
          <input type="text" v-model="proposedClassName" placeholder="Enter proposed class type name">
          <button @click="proposeClassType">Propose Class Type</button>
        </div>
      </div>
    </div>
  </template>
  
<script>
import AXIOS from './axiosConfig.js';
import AnimatedLetters from  "./AnimatedLetters";
import Navbar from "./Navbar";

export default {
  data() {
    return {
      letterClass: "text-animate",
      titleArray: "ClassTypes".split(""),
      classTypes: [],
      classTypesNotFound: false,
      newClassTypeName: "",
      proposedClassName: "",
    };
  },
  computed: {
    approvedClassTypes() {
      return this.classTypes.filter(classType => classType.approved);
    },
    unapprovedClassTypes() {
      return this.classTypes.filter(classType => !classType.approved);
    }
  },
  mounted() {
    setTimeout(() => {
      this.letterClass = "text-animate-hover";
    }, 4000);
    this.fetchClassTypes();
  },
  methods: {
    /** returns a list of classtype objects
     *  
     */
    async fetchClassTypes() {
        try {
            const response = await AXIOS.get('/class-types');
            this.classTypes = response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                this.classTypesNotFound = true;
            } else {
                console.error('Error fetching class types:', error);
            }
        }
    },
    /**
     * creates a classtype dto and calls the post endpoint
     */
    async addClassType() {
        const storedEmail = localStorage.getItem('email');
        if (!storedEmail) {
            alert("You must sign in first.");
            return;
        }
        try {
            const response = await AXIOS.post('/class-types/create/' + storedEmail, {
                name: this.newClassTypeName,
                approved: true
            });
            this.classTypes.push(response.data);
            this.newClassTypeName = "";

            if (this.classTypesNotFound && this.classTypes.length > 0) {
                this.classTypesNotFound = false;
            }
        } catch (error) {
            alert(error.response.data);
            console.error('Error adding class type:', error);
        }
    },
    /**
     * Allows certain users to post a classtype with that is not approved
     */
    async proposeClassType() {
        const storedEmail = localStorage.getItem('email');
        if (!storedEmail) {
            alert("You must sign in first.");
            return;
        }
        try {
            const response = await AXIOS.post('/class-types/propose/' + this.proposedClassName, {
                email: storedEmail,
                password: "password",
                person: null
            });
            this.classTypes.push(response.data);
            this.proposedClassName = "";
        } catch (error) {
            alert(error.response.data);
            console.error('Error proposing class type:', error);
        }
    },
    /**
     * Changes the isapproved to false
     * @param {*} classType the classtype object being updated
     * 
     */
    async approveClassType(classType) {
        const storedEmail = localStorage.getItem('email');
        if (!storedEmail) {
            alert("You must sign in first.");
            return;
        }
        try {
            const response = await AXIOS.put('/class-types/approve/' + classType.name, {
                email: storedEmail
            });
            classType.approved = true;
        } catch (error) {
            console.error('Error approving class type:', error);
        }
    }, 
    /**
     * Calls the delete method on a classtype
     * @param {*} classType //the classtype to be deleted
     */
    async deleteClassType(classType) {
        const storedEmail = localStorage.getItem('email');
        if (!storedEmail) {
            alert("You must sign in first.");
            return;
        }
        try {
            const response = await AXIOS.delete('/class-types/delete/' + classType.name, {
                data: {
                    email: storedEmail,
                    password: "password",
                    person: null
                }
            });
            const index = this.classTypes.findIndex(ct => ct.id === classType.id);
            if (index !== -1) {
            this.classTypes.splice(index, 1);
            }
        } catch (error) {
            console.error('Error deleting class type:', error);
        }
    },
    /**
     * Calls put on a classtype
     * @param {*} classType //the classtype to be edited
     */
    async editClassType(classType) {
      const newName = prompt("Enter new class type name:", classType.name);
      if (newName !== null) {
        const storedEmail = localStorage.getItem('email');
        if (!storedEmail) {
          alert("You must sign in first.");
          return;
        }
        try {
          const response = await AXIOS.put('/class-types/' + classType.name + '/email/' + storedEmail, {
            name: newName,
            approved: classType.approved
          })
          const updatedClassType = response.data;
          const index = this.classTypes.findIndex(ct => ct.id === updatedClassType.id);
          if (index !== -1) {
            this.classTypes.splice(index, 1, updatedClassType);
          }
        } catch (error) {
          alert(error.response.data);
          console.error("Error updating class type: ", error)
        }
      }
    }
  },
  components: {
    AnimatedLetters,
    Navbar 
  }
};
</script>
  
  <style scoped>
.classtype-page .container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.classtype-page .text-zone {
  flex: 1;
  display: flex;
  justify-content: center;
  overflow-y: auto; /* Added overflow handling */
}

.left-section {
  width: 50%;
  padding-right: 10px;
  margin-left: 20px;
  animation: fadeIn 1s 1.8s backwards;
}

.right-section {
  width: 50%;
  padding-left: 10px;
  animation: fadeIn 1s 1.8s backwards;
}

.classtype-page h1 {
  color: #fff;
  font-size: 60px;
  margin-top: 120px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
}

.classtype-page h1::before {
  color: #00b3ff;
  position: absolute;
  margin-top: -40px;
  left: 15px;
  opacity: 0.6;
}

.classtype-page h1::after {
  color: #00b3ff;
  position: absolute;
  margin-top: 18px;
  left: 20px;
  animation: fadeIn 1s 1.7s backwards;
  opacity: 0.6;
}

.classtype-page h2 {
  color: #fff;
  margin-top: 20px;
  font-weight: 400;
  font-size: 14px;
  letter-spacing: 2px;
  animation: fadeIn 1s 1.8s backwards;
}

.classtype-page h3 {
  color: #fff; 
  font-size: 24px; 
  margin-top: 30px; 
  font-weight: 600; 
}

.classtype-page h3::before {
  content: ""; 
  display: inline-block;
  width: 10px;
  height: 10px; 
  background-color: #00b3ff;
  margin-right: 10px; 
  border-radius: 50%; 
}

.classtype-page h3 + ul {
  margin-top: 10px; 
}

.classtype-page h3 + ul li {
  color: #fff; 
  margin-top: 5px;
}

.classtype-page h3 + ul li button {
  background-color: #00b3ff;
  color: #fff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  margin-left: 10px; 
  border-radius: 5px; 
}

.classtype-page h3 + ul li button:hover {
  background-color: #0080ff; 
}

.classtype-page input[type="text"] {
  padding: 10px; 
  margin-top: 10px;
  width: 100%;
  border: 2px solid #00b3ff;
  border-radius: 5px;
  background-color: #1a1a1a; 
  color: #fff; 
  box-sizing: border-box; 
}

.classtype-page input[type="text"]::placeholder {
  color: #aaa; 
}

.classtype-page button {
  background-color: #00b3ff; 
  color: #fff; 
  border: none;
  padding: 10px 20px;
  margin-top: 10px; 
  cursor: pointer;
  border-radius: 5px; 
  transition: background-color 0.3s; 
}

.classtype-page button:hover {
  background-color: #0080ff; 
}

.classtype-page button + button {
  margin-left: 10px; 
}

@keyframes pulse512 {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 64, 255, 0.6);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(0, 64, 255, 0%);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(0, 64, 255, 0%);
  }
}

@media screen and (max-width: 1580px) {
  .classtype-page h1 {
    font-size: 50px;
  }
}

@media screen and (max-width: 1320px) {
  .classtype-page h1 {
    font-size: 40px;
  }
}

@media screen and (max-width: 1150px) {
  .classtype-page h1 {
    margin-top: 0;
  }
}

@media screen and (max-width: 1050px) {
  .classtype-page h1 {
    font-size: 29px;
    justify-content: center;
    letter-spacing: 0.5px;
  }

  .classtype-page .text-zone {
    position: initial;
    width: 100%;
    transform: none;
    padding: 10px;
    box-sizing: border-box;
    display: inline-block;
    text-align: left;
    margin-left: 20px;
  }

  .classtype-page h2 {
    font-size: 12px;
  }

  .classtype-page .logo-container {
    position: relative;
    width: 200px;
    height: auto;
    right: 0;
    box-sizing: border-box;
    margin: auto;
    left: 0;
  }
}

  </style>  