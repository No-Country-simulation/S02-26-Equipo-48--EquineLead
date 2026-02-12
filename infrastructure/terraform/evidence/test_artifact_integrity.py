import joblib
import os
import sys

# Configuramos la ruta relativa al modelo desde ml-python/src/app/
# Subimos dos niveles (.. / ..) para llegar a ml-python/ y luego bajamos a data/models/
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_FILE = os.path.join(BASE_DIR, "..", "..", "data", "models", "modelo_sentimiento_pipeline.pkl")

def verify_integrity():
    print(f"--- Iniciando Validación Técnica de Artefacto ---")
    print(f"Ruta detectada: {os.path.abspath(MODEL_FILE)}")
    
    if not os.path.exists(MODEL_FILE):
        print(f"[-] ERROR: No se encuentra el archivo .pkl en la ruta especificada.")
        return

    try:
        # Carga física
        pipeline = joblib.load(MODEL_FILE)
        print(f"[+] ÉXITO: Integridad de bits verificada (Carga correcta).")
        
        # Validación de estructura del Pipeline
        pasos = [name for name, _ in pipeline.steps]
        print(f"[+] Estructura del Pipeline: {pasos}")
        
        # Liberación de memoria inmediata
        del pipeline
        print("[+] Memoria RAM liberada.")
        
    except Exception as e:
        print(f"[-] FALLO CRÍTICO: Error de deserialización o incompatibilidad. {e}")

if __name__ == "__main__":
    verify_integrity()