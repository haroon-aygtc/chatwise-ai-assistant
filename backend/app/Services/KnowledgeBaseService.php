<?php

namespace App\Services;

use App\Models\DocumentCategory;
use App\Models\KnowledgeDocument;
use App\Models\KnowledgeBaseSetting;
use App\Models\KnowledgeResource;
use App\Models\FileResource;
use App\Models\DirectoryResource;
use App\Models\WebResource;
use App\Models\ResourceCollection;
use App\Models\KnowledgeProfile;
use App\Models\ContextScope;
use App\Models\DataSource;
use App\Models\DataSourceSetting;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class KnowledgeBaseService
{
    /**
     * Get all data sources
     *
     * @return Collection
     */
    public function getAllDataSources(): Collection
    {
        return DataSource::orderBy('priority', 'desc')->get();
    }

    /**
     * Get a data source by ID
     *
     * @param string $id
     * @return DataSource|null
     */
    public function getDataSourceById(string $id): ?DataSource
    {
        return DataSource::find($id);
    }

    /**
     * Create a new data source
     *
     * @param array $data
     * @return DataSource
     */
    public function createDataSource(array $data): DataSource
    {
        return DataSource::create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'type' => $data['type'],
            'configuration' => $data['configuration'] ?? [],
            'isActive' => $data['isActive'] ?? true,
            'priority' => $data['priority'] ?? 5,
        ]);
    }

    /**
     * Update a data source
     *
     * @param string $id
     * @param array $data
     * @return DataSource|null
     */
    public function updateDataSource(string $id, array $data): ?DataSource
    {
        $dataSource = DataSource::find($id);

        if (!$dataSource) {
            return null;
        }

        $updateData = [];

        if (isset($data['name'])) {
            $updateData['name'] = $data['name'];
        }

        if (isset($data['description'])) {
            $updateData['description'] = $data['description'];
        }

        if (isset($data['type'])) {
            $updateData['type'] = $data['type'];
        }

        if (isset($data['configuration'])) {
            $updateData['configuration'] = $data['configuration'];
        }

        if (isset($data['isActive'])) {
            $updateData['isActive'] = (bool) $data['isActive'];
        }

        if (isset($data['priority'])) {
            $updateData['priority'] = (int) $data['priority'];
        }

        $dataSource->update($updateData);
        return $dataSource->fresh();
    }

    /**
     * Delete a data source
     *
     * @param string $id
     * @return bool
     */
    public function deleteDataSource(string $id): bool
    {
        $dataSource = DataSource::find($id);

        if (!$dataSource) {
            return false;
        }

        return (bool) $dataSource->delete();
    }

    /**
     * Test a data source
     *
     * @param string $id
     * @param string $query
     * @return array
     */
    public function testDataSource(string $id, string $query): array
    {
        $dataSource = DataSource::find($id);

        if (!$dataSource) {
            throw new \Exception('Data source not found');
        }

        // In a real implementation, this would connect to the actual data source
        // For now, we'll return a simulated response based on the data source type
        $result = "Test result for query: {$query} using {$dataSource->name}";
        $sources = [];

        switch ($dataSource->type) {
            case 'database':
                $sources = [
                    ['title' => 'Database record 1', 'url' => null],
                    ['title' => 'Database record 2', 'url' => null],
                ];
                break;

            case 'knowledge-base':
                $sources = [
                    ['title' => 'Knowledge Base Article: ' . Str::limit($query, 20), 'url' => 'https://example.com/kb/article1'],
                    ['title' => 'Related Article', 'url' => 'https://example.com/kb/article2'],
                ];
                break;

            case 'website':
                $sources = [
                    ['title' => 'Web Page: ' . Str::limit($query, 20), 'url' => 'https://example.com/page1'],
                    ['title' => 'Related Page', 'url' => 'https://example.com/page2'],
                ];
                break;

            default:
                $sources = [
                    ['title' => 'Source 1', 'url' => null],
                    ['title' => 'Source 2', 'url' => null],
                ];
        }

        return [
            'result' => $result,
            'sources' => $sources,
        ];
    }

    /**
     * Get data source settings
     *
     * @return array
     */
    public function getDataSourceSettings(): array
    {
        $settings = DataSourceSetting::first();

        if (!$settings) {
            // Create default settings if none exist
            $settings = DataSourceSetting::create([
                'enabled' => true,
                'priority' => 'medium',
                'includeCitation' => true,
            ]);
        }

        return [
            'enabled' => $settings->enabled,
            'priority' => $settings->priority,
            'includeCitation' => $settings->includeCitation,
        ];
    }

    /**
     * Update data source settings
     *
     * @param array $data
     * @return array
     */
    public function updateDataSourceSettings(array $data): array
    {
        $settings = DataSourceSetting::first();

        if (!$settings) {
            $settings = DataSourceSetting::create([
                'enabled' => $data['enabled'] ?? true,
                'priority' => $data['priority'] ?? 'medium',
                'includeCitation' => $data['includeCitation'] ?? true,
            ]);
        } else {
            $updateData = [];

            if (isset($data['enabled'])) {
                $updateData['enabled'] = (bool) $data['enabled'];
            }

            if (isset($data['priority'])) {
                $updateData['priority'] = $data['priority'];
            }

            if (isset($data['includeCitation'])) {
                $updateData['includeCitation'] = (bool) $data['includeCitation'];
            }

            $settings->update($updateData);
        }

        return [
            'enabled' => $settings->enabled,
            'priority' => $settings->priority,
            'includeCitation' => $settings->includeCitation,
        ];
    }
    
    // Existing methods...
}