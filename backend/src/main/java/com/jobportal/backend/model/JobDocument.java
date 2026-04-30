package com.jobportal.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(indexName = "jobs")
public class JobDocument {

    @Id
    private String id; // ES uses string for ID by default

    private Long mysqlJobId; // Keep reference to original DB ID

    @Field(type = FieldType.Text, analyzer = "standard")
    private String title;

    @Field(type = FieldType.Text, analyzer = "standard")
    private String description;

    @Field(type = FieldType.Keyword)
    private String location;

    @Field(type = FieldType.Double)
    private Double salaryMin;

    @Field(type = FieldType.Double)
    private Double salaryMax;

    @Field(type = FieldType.Integer)
    private Integer experienceRequired;

    @Field(type = FieldType.Keyword)
    private String jobType;

    @Field(type = FieldType.Keyword)
    private String industry;

    @Field(type = FieldType.Text)
    private String requiredSkills;

    @Field(type = FieldType.Keyword)
    private String companyName;

    @Field(type = FieldType.Keyword)
    private String status;
}
