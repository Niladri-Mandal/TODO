const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/addtask', (req, res) => {
    const { title, id, status } = req.body;

    if (!title || !id || !status) {
        return res.status(400).send('Invalid input. Please provide title, id, and status.');
    }

    fs.readFile('todo.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }

        const tasks = JSON.parse(data);
        tasks.push({ title, id, status });

        fs.writeFile('todo.json', JSON.stringify(tasks), (err) => {
            if (err) {
                return res.status(500).send('Internal Server Error');
            }
            res.status(200).send('Task added successfully');
        });
    });
});

app.get('/tasks', (req, res) => {
    const { status } = req.query;

    if (status !== 'pending') {
        return res.status(400).send('Invalid status. Only "pending" status is supported.');
    }

    fs.readFile('todo.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }

        const tasks = JSON.parse(data).filter(task => task.status === 'pending');
        res.status(200).json(tasks);
    });
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

