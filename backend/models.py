from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    """Modelo de usuário"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamento com progresso de leitura
    reading_progress = db.relationship('ReadingProgress', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        """Define a senha do usuário (hash)"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Verifica se a senha está correta"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Converte o usuário para dicionário"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<User {self.username}>'


class ReadingProgress(db.Model):
    """Modelo de progresso de leitura por capítulo"""
    __tablename__ = 'reading_progress'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    chapter_key = db.Column(db.String(50), nullable=False, index=True)  # Ex: "Capítulo 1"
    progress = db.Column(db.Float, default=0.0)  # Progresso de 0.0 a 1.0
    last_position = db.Column(db.Integer, default=0)  # Última posição de scroll ou seção
    completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Índice composto para consultas rápidas
    __table_args__ = (
        db.UniqueConstraint('user_id', 'chapter_key', name='unique_user_chapter'),
    )
    
    def to_dict(self):
        """Converte o progresso para dicionário"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'chapter_key': self.chapter_key,
            'progress': self.progress,
            'last_position': self.last_position,
            'completed': self.completed,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<ReadingProgress user={self.user_id} chapter={self.chapter_key} progress={self.progress}>'
