import { unlink } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request) {
    try {
        const { filePath } = await request.json();

        if (!filePath || !filePath.startsWith('/')) {
            return NextResponse.json({ error: 'Caminho de arquivo inválido' }, { status: 400 });
        }

        // Construímos o caminho absoluto no sistema de arquivos
        // Caminho esperado: /assets/hotspots/nome_da_imagem.jpg
        const fullPath = path.join(process.cwd(), 'public', filePath);

        try {
            await unlink(fullPath);
            return NextResponse.json({ success: true, message: 'Arquivo excluído com sucesso' });
        } catch (err) {
            if (err.code === 'ENOENT') {
                // Se o arquivo não existir, consideramos sucesso (já sumiu)
                return NextResponse.json({ success: true, message: 'Arquivo não encontrado, mas operação ok' });
            }
            throw err;
        }

    } catch (error) {
        console.error('Erro ao excluir arquivo:', error);
        return NextResponse.json({ error: 'Falha ao excluir arquivo no servidor' }, { status: 500 });
    }
}
