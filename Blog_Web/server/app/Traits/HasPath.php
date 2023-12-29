<?php

namespace App\Traits;

use App\Models\Directory;
use Exception;
use Illuminate\Database\Eloquent\Casts\Attribute;

trait HasPath
{
  protected function path(): Attribute
  {
    try {
      $directory_id = $this->directory_id;
      $directory = Directory::find($directory_id);

      $path = array(
        (object) [
          'icon' => $directory->icon,
          'id' => $directory->id,
          'title' => $directory->title,
        ]
      );

      $parent_dir_id = $directory->directory_id;

      // Add a check for `null`
      if ($parent_dir_id == null) {
        return Attribute::make(
          get: fn () => $path,
        );
      }

      $parent_dir = Directory::find($parent_dir_id);

      while ($parent_dir->title != 'Private' && $parent_dir->title != 'Public') {
        array_unshift(
          $path,
          (object) [
            'icon' => $parent_dir->icon,
            'id' => $parent_dir->id,
            'title' => $parent_dir->title,
          ]
        );

        $parent_dir_id = $parent_dir->directory_id;

        // Add a check for `null`
        if ($parent_dir_id == null) {
          return Attribute::make(
            get: fn () => $path,
          );
        }

        $parent_dir = Directory::find($parent_dir_id);
      }

      // Append the Public / Private dir
      array_unshift(
        $path,
        (object) [
          'icon' => $parent_dir->icon,
          'id' => $parent_dir->id,
          'title' => $parent_dir->title,
        ]
      );

      return Attribute::make(
        get: fn () => $path,
      );
    } catch (Exception $e) {
      return Attribute::make(
        get: fn () => $e->getMessage(),
      );
    }
  }
}
