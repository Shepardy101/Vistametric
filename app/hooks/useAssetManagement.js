import { useCallback } from 'react';

/**
 * Hook para gerenciar o upload de assets (modelos e imagens) e deleção de arquivos.
 */
export function useAssetManagement(setLoading) {

    /**
     * Realiza o upload de um novo modelo 3D (.glb).
     */
    const uploadModel = useCallback(async (file) => {
        if (!file) return null;
        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true);
            const response = await fetch('/api/upload-model', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (result.success) {
                return { name: result.name, url: result.url };
            } else {
                alert("❌ Erro no upload: " + result.error);
                return null;
            }
        } catch (err) {
            console.error("Erro ao importar modelo:", err);
            alert("Erro de conexão com o servidor de upload.");
            return null;
        } finally {
            setLoading(false);
        }
    }, [setLoading]);

    /**
     * Remove um arquivo físico do servidor.
     */
    const deletePhysicalFile = useCallback(async (filePath) => {
        if (!filePath || !filePath.startsWith('/')) return;
        try {
            await fetch('/api/delete-file', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filePath })
            });
        } catch (err) {
            console.error("Falha ao deletar arquivo físico:", err);
        }
    }, []);

    return { uploadModel, deletePhysicalFile };
}
