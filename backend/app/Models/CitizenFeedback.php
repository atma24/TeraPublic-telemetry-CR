<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CitizenFeedback extends Model
{
    use HasFactory;

    protected $table = 'citizen_feedbacks';

    protected $fillable = [
        'facility_id',
        'tracking_code',
        'citizen_name',
        'citizen_email',
        'title',
        'description',
        'category',
        'photo_url',
        'latitude',
        'longitude',
        'status',
        'admin_response',
        'resolved_at',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'resolved_at' => 'datetime',
    ];

    public function facility(): BelongsTo
    {
        return $this->belongsTo(PublicFacility::class, 'facility_id');
    }
}
