<template>
    <div class="footer">
        <router-link to="/">
            <a href="#" class="item">
                <img src="/static/images/browse.png" alt="alt text">
                <p class="caption">Browse</p>
            </a>
        </router-link>
        <router-link to="/search-spaces">
            <a href="#" class="item">
                <img src="/static/images/search.png" alt="alt text">
                <p class="caption">Search</p>
            </a>
        </router-link>
        <router-link to="/booked-spaces">
            <a href="#" class="item">
                <img src="/static/images/booked.png" alt="alt text">
                <p class="caption">My Spaces</p>
            </a>
        </router-link>
        <router-link to="/add-space">
            <a href="/add-space" class="item">
                <img src="/static/images/new.png" alt="alt text">
                <p class="caption">New Space</p>
            </a>
        </router-link>
    </div>
</template>
