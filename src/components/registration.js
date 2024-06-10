import axios from "axios"
import config from '../../config'

const frontendUrl = 'http://' + config.dev.host + ':' + config.dev.port
const backendUrl = 'http://' + config.dev.backendHost + ':' + config.dev.backendPort

const AXIOS = axios.create({
    baseURL: backendUrl,
    headers: { 'Access-Control-Allow-Origin': frontendUrl}
})

function PersonDto (name) {
    this.name = name
    this.events = []
}

// function EventDto (name, date, start, end) {
//     this.name = name
//     this.eventDate = date
//     this.startTime = start
//     this.endTime = end
// }

export default {
    name: 'gymregistration',
    data () {
        return {
            persons: [],
            newPerson: '',
            errorPerson: '',
            response: []
        }
    }, 
    created: function () {
        // // Test data
        // const p1 = new PersonDto('John');
        // const p2 = new PersonDto('Jill');
        // // Sample initial content
        // this.persons = [p1, p2];
        // Initializing persons from backend
        AXIOS.get('/persons')
        .then(response => {
            this.persons = response.data;
        })
        .catch(e => {
            this.errorPerson = e;
        });
        // Initializing events
        // AXIOS.get('/events')
        // .then(response => {
        // this.events = response.data
        // })
        // .catch(e => {
        // this.errorEvent = e
        // // this.errors.push(e)
        // })
      },
      methods: {
        createPerson: function (personName) {
        //   // Create a new person and add it to the list of people
        //   const p = new PersonDto(personName);
        //   this.persons.push(p);
        //   // Reset the name field for new people
        //   this.newPerson = '';
            AXIOS.post('/persons/create', { name: personName})
            .then(response => {
                this.persons.push(response.data)
                this.errorPerson = ''
                this.newPerson = ''
            })
            .catch(e => {
                const errorMsg = e.response.data.message
                console.log(errorMsg)
                this.errorPerson = errorMsg
            })
        }
    }
}