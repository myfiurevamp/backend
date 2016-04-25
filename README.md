# MyFIU (Backend)
> Your student university portal, made richer and smarter

MyFIU-Revamped is a full-stack web platform that allows university students to explore their student portal with a richer and more intuitive platform. In a way, MyFIU-Revamped becomes your personal college path assistant. It is composed of a decoupled backend JSON API and a front-end web application.

In our case, we created a demonstration of MyFIU-Revamped interfacing with our university's MyFIU student portal, but our platform can interface with any university platform in practice. It works by scraping a student's dataset from their portal upon giving us their student portal credentials.

## Statistical Analysis
Our backend utilizes data gathered from transcripts and online grade distributions present on your student portal. Using this, we determine how well you will do in specific courses and on your major as a whole. Currently, our statistical inference only works for Computer Science majors (because of time constraints, but the applications are endless).

Under the hood, our backend passes a JSON file of the student's academic data to the analysis engine that does our predictions. A sample of the passed data looks like this:
```javascript
[{
    id: "CHM 1045",
    name: "Chemistry 1",
    semesterLabel: "Fall Semester 2015",
    grade: "A",
    units: "3.00"
}, {...}]

```

The analysis engine returns this, which the backend API shuttles forward to the front-end:
```javascript
{
    "expectedGpa": "3.0", 
    "recommendedCourses": ["CHM 1045"]
}
```

## API Endpoints
All API endpoints have the prefix `api/<myfiuRevampedVersion>`. All the API endpoints return an output that has the form:

```javascript
{
    "status": "<int: httpStatusCode>",
    "message" "<string: additional request/response information">,
    "data": "<?: whatever the API endpoint should return>"
}
```

1. `/login`
    * Given FIU credentials, return a JWT Token with the user's type (permissions), university email address, system supplied unique identifier and name.
        * **POST**
        * Accepts {username, password}
        * Returns {jwtToken}
2. `/auth`
    * All these API endpoints require either an: 
        * `Authorization: Bearer <jwtToken>` provided as the Authorization header **OR** 
        * `token=<jwtToken>` as part of the request parameters
    * **GET** `/courses/present`
        * Returns a list of all courses that a student is currently taking
        * Returns [{id, name, semesterLabel, semesterMonth, semesterYear, units, grade}]
    * **GET** `/courses/all`
        * Returns a list of all courses that a student has taken up to now
        * Returns [{id, name, semesterLabel, semesterMonth, semesterYear, units, grade}]
    * **GET** `/prediction`
        * Returns a personalized prediction set of your academic path, using our analysis engine
        * Returns {expectedGpa, recommendedCourses:[]}

## Docker Environment
A `docker-compose.yml` and `Dockerfile` file of our entire backend's environment is available is provided at our repository that automatically allows you to have a working version of this software in your desktop or production environment in an instant. This includes all of the environment dependencies needed to run MyFIU-Backend, from Node, PhantomJS and CasperJS to PostgreSQL.

If you have Docker installed on your system, simply `docker-compose up` and you're on your way! For more information on Docker, check out the [Docker website](https://www.docker.com/) and the [Docker Compose](https://docs.docker.com/compose/overview/) websites.