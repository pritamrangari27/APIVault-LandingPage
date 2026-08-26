import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base

class Scan(Base):
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    endpoints = relationship("EndpointAnalysis", back_populates="scan", cascade="all, delete-orphan")


class EndpointAnalysis(Base):
    __tablename__ = "endpoint_analyses"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scans.id"))
    method = Column(String)
    path = Column(String)
    architecture_suggestions = Column(Text, nullable=True)

    scan = relationship("Scan", back_populates="endpoints")
    findings = relationship("Vulnerability", back_populates="endpoint", cascade="all, delete-orphan")


class Vulnerability(Base):
    __tablename__ = "vulnerabilities"

    id = Column(Integer, primary_key=True, index=True)
    endpoint_analysis_id = Column(Integer, ForeignKey("endpoint_analyses.id"))
    vulnerability = Column(String)
    severity = Column(String)
    fix_code = Column(Text)
    explanation = Column(Text)

    endpoint = relationship("EndpointAnalysis", back_populates="findings")
