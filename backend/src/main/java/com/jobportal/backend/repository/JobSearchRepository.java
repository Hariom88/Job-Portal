package com.jobportal.backend.repository;

import com.jobportal.backend.model.JobDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobSearchRepository extends ElasticsearchRepository<JobDocument, String> {

    // Spring Data Elasticsearch derived queries
    List<JobDocument> findByTitleOrDescriptionOrRequiredSkills(String title, String desc, String skills);
    
    Optional<JobDocument> findByMysqlJobId(Long mysqlJobId);
}
