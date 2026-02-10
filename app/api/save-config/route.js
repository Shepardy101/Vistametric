import { writeFile, mkdir } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request) {
    try {
        const data = await request.json();

        if (!data) {
            return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
        }

        const configDir = path.join(process.cwd(), 'public', 'data');
        const fullPath = path.join(configDir, 'project_config.json');

        // Garantimos que a pasta existe
        await mkdir(configDir, { recursive: true });

        // Salva o JSON no disco formatado para fácil leitura humana
        await writeFile(fullPath, JSON.stringify(data, null, 2));

        return NextResponse.json({
            success: true,
            message: 'Configuração salva no projeto com sucesso!'
        });

    } catch (error) {
        console.error('Erro ao salvar config:', error);
        return NextResponse.json({ error: 'Falha ao salvar configuração no servidor' }, { status: 500 });
    }
}
