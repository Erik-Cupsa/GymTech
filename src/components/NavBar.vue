<template>
    <div class="nav-bar">
        <nav :class="{ 'mobile-show': showNav }">
            <a href="#/" target="_self" rel="noopener noreferrer" @click="closeNav" data-text="Home">
                <img class="icon" src="@/assets/Home.png" alt="Home Logo" />
            </a>
            <a class="classtypes-link"  href="#/class-types" target="_self" rel="noopener noreferrer" @click="closeNav" data-text="ClassTypes">
                <img src="@/assets/ClassTypes.png" class="icon" alt="ClassTypes Logo" />
            </a>
            <a class="session-link" :href="getSessionLink(accountType)" target="_self" rel="noopener noreferrer" @click="closeNav" data-text="Sessions">
                <img src="@/assets/Session.png" class="icon" alt="Session Logo" />
            </a>
            <a class="account-link" href="#/accounts" target="_self" rel="noopener noreferrer" @click="closeNav" data-text="Accounts">
                <img src="@/assets/Account.png" class="icon" alt="Account Logo" />
            </a>
            <a v-if="storedEmail" class="account-details-link" href="#/account-details" @click="closeNav" data-text="AccountDetails"> 
                <img src="@/assets/AccountSettings.png" class="icon" alt="Details" />
            </a>
            <a v-if="storedEmail" class="customer-registrations-link" href="#/customer-registrations" @click="closeNav" data-text="Registrations"> 
                <img src="@/assets/Registration.png" class="icon" alt="Account Details" />
            </a>
            <a v-if="!storedEmail" class="button-link" href="#/login" target="_self" rel="noopener noreferrer" @click="closeNav">
                SIGN IN
            </a>
            <a v-if="storedEmail" class="button-link" href="#/" target="_self" rel="noopener noreferrer" @click="logout">
                LOG OUT
            </a>
            <img src="@/assets/Closed.png" width="40px" alt="Gym Logo" class="close-icon" @click="closeNav" />
        </nav>
        <img @click="toggleNav" src="@/assets/Hamburger.png" width="60px" alt="Gym Logo" class="hamburger-icon" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            showNav: false,
            storedEmail: localStorage.getItem('email'),
            accountType: localStorage.getItem('accountType')
        }
    },
    methods: {
        getSessionLink(){
            switch(localStorage.getItem('accountType')){
                case 'customers':
                    return '#/view-session-client';
                default:
                    return '#/view-session-staff';
            }
        },
        closeNav() {
            this.showNav = false;
        },
        toggleNav() {
            this.showNav = !this.showNav;
        },
        logout() {
            this.closeNav();
            localStorage.clear();
            this.storedEmail = null;
            alert('You have been logged out');
            this.$router.push({ name: 'Home' });
        }
    }
}
</script>

<style scoped>
.nav-bar {
    background: transparent;
    width: 100%;
    height: 130px;
    position: fixed;
    top: 0;
    z-index: 3;
    display: flex;
    align-items: center;
}

.nav-bar nav {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    padding-left: 0;
    flex-grow: 1;
}

.nav-bar nav a,
.nav-bar nav a:focus {
    font-size: 25px;
    color: #f0f0f083;
    display: block;
    margin: 0 60px;
    position: relative;
    text-decoration: none;
    outline: none;
}

.nav-bar nav a:hover {
    color: #fff;
}

.nav-bar nav a:after {
    content: attr(data-text);
    font-size: 20px;
    letter-spacing: 2px;
    position: absolute;
    top: 80%;
    left: 75%;
    transform: translateX(-50%);
    opacity: 0;
    transition: opacity 0.3s ease-out;
}

.nav-bar nav a:hover:after,
.nav-bar nav a:focus:after {
    opacity: 1;
}

.nav-bar .button-link {
    border: none;
    color: #fff;
    background-image: linear-gradient(30deg, #0040ff, #15fd98);
    border-radius: 10px;
    background-size: 100% auto;
    font-family: inherit;
    font-size: 15px;
    padding: 0.6em 1.5em;
    white-space: nowrap;
    outline: none;
}

.nav-bar .button-link:hover {
    background-position: right center;
    background-size: 200% auto;
    -webkit-animation: pulse 2s infinite;
    animation: pulse512 1.5s infinite;
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

.nav-bar .icon {
    width: 60%;
    max-width: 50px;
    margin: 30px;
    opacity: 0.8;
    position: relative;
}

.hamburger-icon,
.close-icon {
    display: none;
}

@media screen and (max-width: 1150px) {
    .nav-bar {
        position: initial;
        height: 100px;
    }

    .nav-bar nav {
        display: none;
        width: 100%;
        height: 100%;
        background: #030712;
        top: 0;
        left: 0;
        position: fixed;
        z-index: 2;
        margin: 0;
    }

    .nav-bar nav.mobile-show {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .hamburger-icon,
    .close-icon {
        display: block;
        position: absolute;
        top: 15px;
        right: 15px;
        color: #f76d3f;
    }

    .button-link {
        margin-top: 1rem;
    }
}

@media screen and (max-width: 500px) {
    .nav-bar nav a {
        padding-left: 0.5rem;
    }

    .button-link {
        margin-left: 32%;
    }
}
</style>
