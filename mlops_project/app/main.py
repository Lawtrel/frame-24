import io
import json
import logging
import os
import random

import joblib
import pandas as pd
from flask import Flask, jsonify, render_template, request
from sklearn.datasets import load_breast_cancer
from tensorflow.keras.models import load_model

logger = logging.getLogger("app.main")

MOVIE_DB = [
    {"title": "Duna: Parte Dois", "genre": "Ficção Científica", "desc": "continuação épica que expande o universo de Arrakis com visuais deslumbrantes", "rating": 5},
    {"title": "Oppenheimer", "genre": "Drama", "desc": "drama histórico intenso sobre o criador da bomba atômica", "rating": 5},
    {"title": "Pobres Criaturas", "genre": "Ficção Científica", "desc": "ficção científica excêntrica e visualmente impressionante", "rating": 4},
    {"title": "Interestelar", "genre": "Ficção Científica", "desc": "viagem espacial emocionante que mistura ciência e emoção familiar", "rating": 5},
    {"title": "Clube da Luta", "genre": "Drama", "desc": "clássico provocador que questiona identidade e consumo", "rating": 5},
    {"title": "O Senhor dos Anéis: O Retorno do Rei", "genre": "Fantasia", "desc": "fantasia épica com batalhas grandiosas e desfecho emocionante", "rating": 5},
    {"title": "Coringa", "genre": "Drama", "desc": "estudo psicológico sombrio sobre os limites da sanidade", "rating": 4},
    {"title": "Parasita", "genre": "Drama", "desc": "sátira social premiada que mistura suspense e crítica de classe", "rating": 5},
    {"title": "Tudo em Todo Lugar ao Mesmo Tempo", "genre": "Ação", "desc": "multiverso criativo e emocionante sobre escolhas e família", "rating": 4},
    {"title": "Whiplash", "genre": "Drama", "desc": "drama musical intenso sobre ambição e perfeccionismo", "rating": 5},
    {"title": "A Chegada", "genre": "Ficção Científica", "desc": "ficção científica reflexiva sobre linguagem e tempo", "rating": 4},
    {"title": "Mad Max: Estrada da Fúria", "genre": "Ação", "desc": "ação alucinante em um mundo pós-apocalíptico", "rating": 5},
    {"title": "Vingadores: Ultimato", "genre": "Ação", "desc": "batalha épica para salvar o universo com heróis icônicos", "rating": 4},
    {"title": "O Auto da Compadecida", "genre": "Comédia", "desc": "comédia brasileira irresistível com humor e emoção", "rating": 5},
    {"title": "Cidade de Deus", "genre": "Drama", "desc": "retrato cru e brilhante da vida no Rio de Janeiro", "rating": 5},
    {"title": "Matrix", "genre": "Ficção Científica", "desc": "realidade virtual revolucionária que desafia a percepção", "rating": 5},
    {"title": "O Poderoso Chefão", "genre": "Drama", "desc": "obra-prima do cinema sobre poder, família e legado", "rating": 5},
    {"title": "Forrest Gump", "genre": "Drama", "desc": "jornada emocionante através de décadas da história americana", "rating": 5},
    {"title": "O Cavaleiro das Trevas", "genre": "Ação", "desc": "super-herói sombrio com atuação icônica e trama complexa", "rating": 5},
    {"title": "A Origem", "genre": "Ação", "desc": "ficção cerebral sobre sonhos dentro de sonhos", "rating": 4},
]

GENRE_KEYWORDS = {
    "ação": "Ação", "acao": "Ação", "aventura": "Aventura", "comédia": "Comédia", "comedia": "Comédia",
    "drama": "Drama", "terror": "Terror", "suspense": "Drama", "ficção": "Ficção Científica", "ficcao": "Ficção Científica",
    "científica": "Ficção Científica", "cientifica": "Ficção Científica", "fantasia": "Fantasia",
    "romance": "Romance", "animação": "Animação", "animacao": "Animação",
    "ação": "Ação", "heroi": "Ação", "herói": "Ação", "heróis": "Ação", "herois": "Ação",
    "guerra": "Ação", "luta": "Ação", "batman": "Ação", "vingadores": "Ação",
    "épico": "Fantasia", "epico": "Fantasia", "anel": "Fantasia", "senhor dos anéis": "Fantasia",
    "interstellar": "Ficção Científica", "espacial": "Ficção Científica", "espaço": "Ficção Científica",
    "matrix": "Ficção Científica", "duna": "Ficção Científica",
    "risos": "Comédia", "engraçado": "Comédia", "humor": "Comédia",
    "triste": "Drama", "emocionante": "Drama", "emotion": "Drama",
}

MOOD_KEYWORDS = {
    "feliz": ["Comédia", "Aventura"], "alegre": ["Comédia", "Animação"],
    "triste": ["Drama", "Romance"], "depre": ["Drama"],
    "animado": ["Ação", "Aventura"], "empolgado": ["Ação", "Ficção Científica"],
    "refletir": ["Drama", "Ficção Científica"], "pensar": ["Ficção Científica", "Drama"],
    "relaxar": ["Comédia", "Fantasia", "Animação"],
    "medo": ["Terror", "Drama"], "assustar": ["Terror"],
    "suspense": ["Drama", "Ação"], "tenso": ["Drama", "Ação"],
    "família": ["Animação", "Aventura", "Fantasia"], "familia": ["Animação", "Aventura", "Fantasia"],
    "nostalgia": ["Drama", "Comédia"], "nostálgico": ["Drama", "Comédia"],
}

class ModelService:
    def __init__(self) -> None:
        self._load_artifacts()

    def _load_artifacts(self) -> None:
        logger.info("Loading artifacts from local project folder")
        artifacts_dir = "artifacts"
        models_dir = "models"
        features_imputer_path = os.path.join(artifacts_dir, "[features]_mean_imputer.joblib")
        features_scaler_path = os.path.join(artifacts_dir, "[features]_scaler.joblib")
        target_encoder_path = os.path.join(artifacts_dir, "[target]_one_hot_encoder.joblib")
        model_path = os.path.join(models_dir, "model.keras")
        self.features_imputer = joblib.load(features_imputer_path)
        self.features_scaler = joblib.load(features_scaler_path)
        self.target_encoder = joblib.load(target_encoder_path)
        self.model = load_model(model_path)
        logger.info("Successfully loaded all artifacts")

    def predict(self, features: pd.DataFrame) -> pd.Series:
        X_imputed = self.features_imputer.transform(features)
        X_scaled = self.features_scaler.transform(X_imputed)
        y_pred = self.model.predict(X_scaled)
        y_decoded = self.target_encoder.inverse_transform(y_pred)
        return pd.DataFrame({"Prediction": y_decoded.ravel()}, index=features.index)


def recommend_movies(query: str) -> dict:
    query_lower = query.lower().strip()
    words = query_lower.split()

    matched_genres = set()
    for word in words:
        if word in GENRE_KEYWORDS:
            matched_genres.add(GENRE_KEYWORDS[word])
    for word in words:
        if word in MOOD_KEYWORDS:
            for g in MOOD_KEYWORDS[word]:
                matched_genres.add(g)

    matched = []
    if matched_genres:
        for m in MOVIE_DB:
            if m["genre"] in matched_genres:
                matched.append(m)
    else:
        for m in MOVIE_DB:
            if (query_lower in m["title"].lower() or
                query_lower in m["desc"].lower() or
                any(word in m["title"].lower() or word in m["desc"].lower() for word in words if len(word) > 2)):
                matched.append(m)

    if not matched:
        matched = random.sample(MOVIE_DB, min(3, len(MOVIE_DB)))

    matched.sort(key=lambda x: x["rating"], reverse=True)
    recommendations = matched[:3]

    return {
        "recommendations": [
            {
                "title": m["title"],
                "genre": m["genre"],
                "reason": m["desc"],
            }
            for m in recommendations
        ],
        "total_found": len(matched),
    }


def create_routes(app: Flask) -> None:
    @app.route("/")
    def index() -> str:
        return render_template("index.html")

    @app.route("/upload", methods=["POST"])
    def upload() -> str:
        file = request.files["file"]
        if not file.filename.endswith(".csv"):
            return render_template("index.html", error="Please upload a CSV file")
        try:
            content = file.read().decode("utf-8")
            features = pd.read_csv(io.StringIO(content))
            expected_features = load_breast_cancer().feature_names
            missing_cols = [col for col in expected_features if col not in features.columns]
            if missing_cols:
                return render_template("index.html", error=f"Missing required columns: {', '.join(missing_cols)}")
            features = features[expected_features]
            predictions = app.model_service.predict(features)
            result = predictions.to_string()
            return render_template("index.html", predictions=result)
        except Exception as e:
            logger.error(f"Error processing file: {e}", exc_info=True)
            return render_template("index.html", error=f"Error processing file: {str(e)}")

    @app.route("/api/recommend", methods=["POST"])
    def api_recommend():
        data = request.get_json()
        if not data or "query" not in data:
            return jsonify({"error": "Missing 'query' field"}), 400
        query = data["query"]
        result = recommend_movies(query)
        return jsonify(result)

    @app.route("/api/movies", methods=["GET"])
    def api_movies():
        return jsonify({"movies": MOVIE_DB, "total": len(MOVIE_DB)})

    @app.route("/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok", "service": "mlops-recommendation"})


app = Flask(__name__)
app.model_service = ModelService()
create_routes(app)
logger.info("Application initialized with recommendation API")


def main() -> None:
    app.run(host="0.0.0.0", port=5001, debug=True)

if __name__ == "__main__":
    main()
