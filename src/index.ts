import express from 'express';
import bodyParser from 'body-parser';
import User from './models/User';
import buildDatabaseSchema from './dbSchemaBuilder';

const app = express();
app.use(bodyParser.json());

app.post('/contacts', async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.create({ username, email });
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/contacts/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/contacts/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { username, email, } = req.body;
    const [updatedCount, [updatedUser]] = await User.update(
      { username, email, },
      { where: { id }, returning: true }
    );
    if (updatedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/contacts/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deletedCount = await User.destroy({ where: { id } });
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

buildDatabaseSchema().then(() => {
  app.listen(4000, () => {
    console.log('Server started on port 4000');
  });
});