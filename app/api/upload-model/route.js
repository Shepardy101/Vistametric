import { writeFile, mkdir } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
        }

        // Validamos se é um arquivo 3D comum
        if (!file.name.endsWith('.glb') && !file.name.endsWith('.gltf')) {
            return NextResponse.json({ error: 'Formato de arquivo não suportado. Use .glb ou .gltf' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Definimos o caminho relativo e absoluto
        const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        const relativePath = `/assets/models/${fileName}`;
        const uploadDir = path.join(process.cwd(), 'public', 'assets', 'models');
        const fullPath = path.join(uploadDir, fileName);

        // Garantimos que a pasta existe
        await mkdir(uploadDir, { recursive: true });

        // Salva o arquivo no disco
        await writeFile(fullPath, buffer);

        return NextResponse.json({
            success: true,
            url: relativePath,
            name: file.name.replace(/\.[^/.]+$/, "") // Nome sem extensão
        });

    } catch (error) {
        console.error('Erro no upload do modelo:', error);
        return NextResponse.json({ error: 'Falha ao salvar modelo no servidor' }, { status: 500 });
    }
}
