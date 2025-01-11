import express from 'express';
import actorsRouter from './routes/actors.js';
import moviesRouter from './routes/movies.js';
const PORT = 3000; 
const app = express();

app.use('/actors', actorsRouter);
app.use('/movies', moviesRouter);
app.use((req, res, next) => {
    const appName = 'movie-server';
    const now = new Date();
    const currentDateTime = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
    console.log('[' + appName + '] [' + currentDateTime + '] ' + req.method + ' ' + req.originalUrl);
    next();
});
  
app.listen(PORT, () => {
    console.log(`Movie server je pokrenut na http://localhost:${port}`);
});