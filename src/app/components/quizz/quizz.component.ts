import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import quizz_questions from '../../../../public/assets/data/quizz_questions.json';
import { Button3dComponent } from "../button3d/button3d.component";

@Component({
  selector: 'app-quizz',
  standalone: true,
  imports: [NgIf, NgFor, Button3dComponent],
  templateUrl: './quizz.component.html',
  styleUrl: './quizz.component.css',
})
export class QuizzComponent {

  title: string = 'Título';

  questionSelected: any;
  questions: any;

  answers: string[] = [];
  answerSelected: string = '';

  questionIndex: number = 0;
  questionMaxIndex: number = 0;

  finished: boolean = false;

  ngOnInit(): void {
    if (quizz_questions) {
      this.finished = false;
      this.title = quizz_questions.title;

      this.questions = quizz_questions.questions;
      this.questionSelected = this.questions[this.questionIndex];

      this.questionIndex = 0;
      this.questionMaxIndex = this.questions.length;

      console.log(this.questionIndex, this.questionMaxIndex);
    }
  }

  playerChoose(value: string) {
    this.answers.push(value);
    this.nextStep();
    console.log(this.answers);
  }

  async nextStep() {
    this.questionIndex += 1;

    if (this.questionMaxIndex > this.questionIndex) {
      this.questionSelected = this.questions[this.questionIndex];
    } else {
      const finalAnswer: string = await this.checkResult(this.answers);
      this.finished = true;
      // transformando em chave do tipo do array result( A ou B )
      this.answerSelected =
        quizz_questions.results[
          finalAnswer as keyof typeof quizz_questions.results
        ];
    }
  }

  async checkResult(answers: string[]) {
    //reduce reduz itera todos os valores jogando nos parâmetros
    const result = answers.reduce((previous, current, i, arr) => {
      //filter itera todos os valores e acumula em um contador se repetir
      if (
        arr.filter((item) => item === previous).length >
        arr.filter((item) => item === current).length
      ) {
        return previous;
      } else {
        return current;
      }
    });
    //retorna A ou B
    return result;
  }

  restartGame() {
    this.answerSelected = '';
    this.answers = [];
    this.questionIndex = 0;
    this.finished = false;
  }
}
