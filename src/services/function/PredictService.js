/* eslint-disable no-underscore-dangle */
const InvariantError = require("../../exceptions/InvariantError");
const tf = require("@tensorflow/tfjs-node");

class PredictService {
  constructor() {
    this.model = null;
  }

  async init() {
    await this.loadModel();
  }

  async loadModel() {
    try {
      const modelUrl = process.env.MODEL_URL;
      if (!modelUrl) {
        throw new InvariantError(
          "Model URL is not defined in the environment variables"
        );
      }
      this.model = await tf.loadGraphModel(modelUrl);
      console.log("Model loaded successfully");
    } catch (error) {
      throw new InvariantError("Failed to load model", error.message);
    }
  }

  determineCategory(genre, bpm) {
    const genreToCategory = {
      classical: ["Sleep", "Relax"],
      metal: ["Depression", "Motivation"],
      pop: ["Anxiety", "Positive Energy"],
    };

    const categoryRules = [
      { keyword: "relax", minBpm: 30, maxBpm: 110 },
      { keyword: "motivation", minBpm: 50, maxBpm: 150 },
      { keyword: "positive energy", minBpm: 60, maxBpm: 170 },
      { keyword: "sleep", minBpm: 30, maxBpm: 90 },
      { keyword: "depression", minBpm: 50, maxBpm: 100 },
      { keyword: "anxiety", minBpm: 60, maxBpm: 120 },
    ];

    genre = genre.toLowerCase();
    if (genre in genreToCategory) {
      const categories = genreToCategory[genre];
      for (const category of categories) {
        for (const rule of categoryRules) {
          if (
            category.toLowerCase().includes(rule.keyword) &&
            rule.minBpm < bpm &&
            bpm <= rule.maxBpm
          ) {
            return category;
          }
        }
      }
    }
    return "Unknown";
  }

  async predictCategory(input, bpm) {
    if (!this.model) {
      throw new InvariantError("Model is not loaded yet");
    }
    try {
      const genreToCategory = {
        Classical: ["Sleep", "Relax"],
        Metal: ["Depression", "Motivation"],
        Pop: ["Anxiety", "Positive Energy"],
      };

      const inputTensor = tf.tensor2d([input], [1, input.length]);
      const predictions = this.model.predict(inputTensor);
      const predictedIndex = (await predictions.argMax(1).data())[0];
      const genre = Object.keys(genreToCategory)[predictedIndex];

      // Determine therapy classification based on genre and bpm
      const category = this.determineCategory(genre, bpm);
      return { genre, category };
    } catch (error) {
      throw new InvariantError("Failed to make prediction", error.message);
    }
  }
}

module.exports = PredictService;
