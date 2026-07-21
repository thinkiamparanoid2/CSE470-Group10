<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    protected $fillable = ['name', 'email', 'phone', 'company_name', 'category', 'rating_sum', 'rating_count'];
    protected $appends = ['average_rating'];

    public function getAverageRatingAttribute()
    {
        return $this->rating_count > 0 ? round($this->rating_sum / $this->rating_count, 1) : 0;
    }
}
