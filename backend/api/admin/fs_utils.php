<?php
require_once dirname(__DIR__, 2) . '/config.php';

function fs_allowed_roots() {
    $base = dirname(__DIR__, 2);
    return [
        'content' => $base . DIRECTORY_SEPARATOR . 'content',
        'locales' => $base . DIRECTORY_SEPARATOR . 'locales',
        'assets_images' => $base . DIRECTORY_SEPARATOR . 'assets' . DIRECTORY_SEPARATOR . 'images',
        'assets_video' => $base . DIRECTORY_SEPARATOR . 'assets' . DIRECTORY_SEPARATOR . 'video',
        'docs' => $base . DIRECTORY_SEPARATOR . 'docs',
        'components' => $base . DIRECTORY_SEPARATOR . 'components',
        'dist' => $base . DIRECTORY_SEPARATOR . 'dist',
        'uploads' => $base . DIRECTORY_SEPARATOR . 'backend' . DIRECTORY_SEPARATOR . 'uploads'
    ];
}

function fs_base_dir($root) {
    $map = fs_allowed_roots();
    return $map[$root] ?? null;
}

function fs_sanitize_relpath($rel) {
    $rel = str_replace(['\\', '\\'], '/', $rel ?? '');
    $rel = ltrim($rel, '/');
    // منع التسرب خارج المجلد
    if (strpos($rel, '..') !== false) {
        return null;
    }
    return $rel;
}

function fs_join($base, $rel) {
    if (!$base) return null;
    $rel = fs_sanitize_relpath($rel);
    if ($rel === null) return null;
    $full = $base . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $rel);
    return $full;
}

function fs_is_inside($path, $base) {
    $rpBase = realpath($base);
    if (!$rpBase) return false;
    $rpPath = realpath($path);
    if ($rpPath === false) {
        // قد يكون الملف جديداً؛ تحقق من المجلد الأب
        $dir = dirname($path);
        $rpDir = realpath($dir);
        if (!$rpDir) return false;
        return strpos($rpDir, $rpBase) === 0;
    }
    return strpos($rpPath, $rpBase) === 0;
}

function fs_is_text_ext($ext) {
    $ext = strtolower($ext);
    $allowed = ['json','md','txt','html','css','js','jsx'];
    return in_array($ext, $allowed, true);
}

function fs_is_upload_ext_allowed($ext, $root) {
    $ext = strtolower($ext);
    $image = ['jpg','jpeg','png','gif','svg'];
    $video = ['mp4','webm','mov'];
    $docs = ['pdf','md','txt'];
    $code = ['json','css','js','jsx','html'];
    if ($root === 'assets_images') return in_array($ext, $image, true);
    if ($root === 'assets_video') return in_array($ext, $video, true);
    if ($root === 'docs') return in_array($ext, $docs, true);
    if ($root === 'content' || $root === 'locales' || $root === 'components') return in_array($ext, array_merge($code, $docs), true);
    if ($root === 'uploads') return in_array($ext, array_merge($image, $docs), true);
    if ($root === 'dist') return false; // منع الرفع داخل dist
    return false;
}

function fs_get_ext($filename) {
    $pos = strrpos($filename, '.');
    return $pos !== false ? substr($filename, $pos + 1) : '';
}

function fs_json_error($msg, $code=400) {
    respondJson(['ok' => false, 'error' => $msg], $code);
}
?>